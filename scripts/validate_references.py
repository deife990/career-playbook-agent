from scripts.common import ROOT, validate_links
def main():
    validate_links(ROOT)
    print('Internal references valid')
if __name__ == '__main__': main()
