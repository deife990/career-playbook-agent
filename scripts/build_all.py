from scripts.build_common import build
def main():
    for platform in ['chatgpt','claude']: print(build(platform))
if __name__ == '__main__': main()
