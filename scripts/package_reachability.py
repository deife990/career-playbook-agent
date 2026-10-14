"""Runtime reachability through entries and the typed canonical contract registry."""
import re
from collections import deque
from urllib.parse import urldefrag
from scripts.common import load
from scripts.package_inventory import inventory


def reference_strings(value):
    if isinstance(value, dict):
        for key, item in value.items():
            if key == '$ref' and isinstance(item, str):
                yield item
            else:
                yield from reference_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from reference_strings(item)


def unreachable(root, platform):
    root = root.resolve()
    files = set(inventory(root, platform))
    # core-index.json is a machine-readable registry of canonical contracts, not
    # an instruction to preload them. This explicitly preserves JSON templates,
    # schema $ids/$refs and router YAML even when no Markdown links name them.
    anchors = {'core-index.json'} | {p for p in files if p.endswith('/SKILL.md') or p == 'SKILL.md'}
    if platform == 'chatgpt':
        anchors |= {'plugin.json', '.codex-plugin/plugin.json'}
    ids = {}
    for relative in files:
        if relative.endswith('.schema.json'):
            value = load(root / relative)
            if value.get('$id') in ids:
                raise ValueError('Duplicate schema ID')
            ids[value['$id']] = relative
    pending = deque(anchors)
    seen = set()
    while pending:
        relative = pending.popleft()
        if relative in seen:
            continue
        if relative not in files:
            raise ValueError('Reference escapes runtime inventory: ' + relative)
        seen.add(relative)
        path = root / relative
        targets = []
        if relative == 'core-index.json':
            targets.extend('references/' + name for name in load(path))
        if path.suffix == '.md':
            for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)', path.read_text()):
                if re.match(r'^[a-z][a-z0-9+.-]*:', link) or link.startswith('#'):
                    continue
                target = (path.parent / link.split('#')[0]).resolve()
                if not target.is_relative_to(root):
                    raise ValueError('Escaping runtime reference')
                targets.append(target.relative_to(root).as_posix())
        if path.suffix == '.json' and relative != 'core-index.json':
            for reference in reference_strings(load(path)):
                uri, fragment = urldefrag(reference)
                if not uri:
                    continue
                if uri in ids:
                    targets.append(ids[uri])
                elif uri.startswith('https://careerpilot.local/schemas/'):
                    raise ValueError('Missing local schema ID: ' + uri)
                elif not re.match(r'^[a-z][a-z0-9+.-]*:', uri):
                    target = (path.parent / uri).resolve()
                    if not target.is_relative_to(root):
                        raise ValueError('Escaping schema reference')
                    targets.append(target.relative_to(root).as_posix())
        pending.extend(targets)
    return sorted(files - seen)


def check_reachability(root, platform):
    missing = unreachable(root, platform)
    if missing:
        raise ValueError('Unreachable runtime files: ' + ', '.join(missing))
