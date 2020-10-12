# -*- coding: UTF-8 -*-
import os
import re

class ImportFixer():

    def __init__(self):
        self.files = []

    def walk(self, root_path):
        tree = os.walk('src')
        for path, dir_list, file_list in tree:  
            for file_name in file_list:
                self.files += [[path, file_name]]

    def find(self, file_name):
        matching = [x[0] for x in self.files if file_name==x[1]]
        if len(matching) == 1:
            return matching[0] + '/' + file_name
        if len(matching) > 1:
            print('! Find multiple version of file "',file_name,'"')
        else:
            return None

    def edit(self, file):
        path = file[0]
        file_name = file[1]
        file_path = path + '/' + file_name
        with open(file_path, 'r+', encoding='utf-8') as f:
            print('> ', file_path)
            lines = f.readlines()
            for i,line in enumerate(lines):
                result = re.match('import (.*?)\'[^@]*\/(.*)\'',line)
                if result is not None:
                    import_parts = result.group(1)
                    import_file_name = result.group(2)
                    print('  > ', import_file_name)
                    import_path = self.find(import_file_name)
                    if import_path is not None:
                        new_import = os.path.relpath(import_path,path)
                        new_import = re.sub(r'\\','/',new_import)
                        if re.match('^\.', new_import) is None:
                            new_import = './' + new_import
                        print('       ',path,' -> ',import_path,' : ',new_import)
                        lines[i] = "import {}'{}';\n".format(import_parts,new_import)
        with open(file_path, 'w+', encoding='utf-8') as f:
            f.writelines(lines)
                        

import_fixer = ImportFixer()
import_fixer.walk('src')
for file in import_fixer.files:
    import_fixer.edit(file)
# import_fixer.edit(import_fixer.files[1])