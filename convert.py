import sys
html = open(r'c:\Users\55619\Downloads\wireframe_portal_ibaneis_rocha (1).html', 'r', encoding='utf-8').read()
body = html.split('<body>')[1].split('</body>')[0]
# remove the script tag at the end
if '<script>' in body:
    body = body.split('<script>')[0]
# escape backticks and dollar signs for JS template literals
body = body.replace('`', '\\`').replace('$', '\\$')
with open('src/app/wireframe.js', 'w', encoding='utf-8') as f:
    f.write('export const rawHTML = `{}  `;\n'.format(body))
