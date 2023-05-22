<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <body>

                <table border="1">
                    <tr bgcolor="#9acd32">
                        <th>Description</th>
                        <th>Value</th>
                    </tr>
                    <xsl:for-each select="gimp-metadata/iptc-tag">
                        <tr>
                            <td>
                                <xsl:value-of select="tag-name" />
                            </td>
                            <td>
                                <xsl:value-of select="tag-value" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>