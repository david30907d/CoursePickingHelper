#!/usr/bin/python2
import pdfcrowd
try:
    # create an API client instance
    client = pdfcrowd.Client("username", "apikey")

    # convert a web page and store the generated PDF into a pdf variable
    pdf = client.convertURI('http://www.google.com')

    # convert an HTML string and save the result to a file
    output_file = open('html.pdf', 'wb')
    html="<head></head><body>My HTML Layout</body>"
    client.convertHtml(html, output_file)
    output_file.close()

    # convert an HTML file
    output_file = open('file.pdf', 'wb')
    client.convertFile('/path/to/MyLayout.html', output_file)
    output_file.close()

except pdfcrowd.Error, why:
    print 'Failed:', why