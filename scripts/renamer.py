# -*- coding: UTF-8 -*-
import os
import re


def walk(path):
    for dirpath, dirs, files in os.walk(path):
        for filename in files:
            if re.search(r'\.js', filename) is not None:
                with open(os.path.join(dirpath, filename), 'r+', encoding='UTF-8') as f:
                    content = f.read()
                    if re.search('\$_documentContainer', content) is not None:
                        new_var_name = re.sub('.js', '', filename)
                        new_var_name = 'container'+re.sub(
                            '-', '', new_var_name.title())
                        new_content = re.sub('\$_documentContainer',
                                             new_var_name, content)
                        f.seek(0)
                        f.truncate()
                        f.write(new_content)


walk(os.path.join(os.getcwd(), 'src'))
walk(os.path.join(os.getcwd(), 'static'))
