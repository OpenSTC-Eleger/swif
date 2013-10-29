define(["moment-timezone"], function (moment) {
    moment.tz.add({
        "zones": {
            "Europe/London": [
                "-0:1:15 - LMT 1847_11_1_0 -0:1:15",
                "0 GB-Eire %s 1968_9_27 1",
                "1 - BST 1971_9_31_2",
                "0 GB-Eire %s 1996",
                "0 EU GMT/BST"
            ],
            "Europe/Madrid": [
                "-0:14:44 - LMT 1901_0_1_0 -0:14:44",
                "0 Spain WE%sT 1946_8_30 2",
                "1 Spain CE%sT 1979 1",
                "1 EU CE%sT"
            ],
            "Europe/Paris": [
                "0:9:21 - LMT 1891_2_15_0_1 0:9:21",
                "0:9:21 - PMT 1911_2_11_0_1 0:9:21",
                "0 France WE%sT 1940_5_14_23 1",
                "1 C-Eur CE%sT 1944_7_25 2",
                "0 France WE%sT 1945_8_16_3 2",
                "1 France CE%sT 1977 1",
                "1 EU CE%sT"
            ],
            "Europe/Rome": [
                "0:49:56 - LMT 1866_8_22 0:49:56",
                "0:49:56 - RMT 1893_10_1_0 0:49:56",
                "1 Italy CE%sT 1942_10_2_2 1",
                "1 C-Eur CE%sT 1944_6 2",
                "1 Italy CE%sT 1980 1",
                "1 EU CE%sT"
            ]
        },
        "rules": {
            "GB-Eire": [
                "1916 1916 4 21 7 2 2 1 BST",
                "1916 1916 9 1 7 2 2 0 GMT",
                "1917 1917 3 8 7 2 2 1 BST",
                "1917 1917 8 17 7 2 2 0 GMT",
                "1918 1918 2 24 7 2 2 1 BST",
                "1918 1918 8 30 7 2 2 0 GMT",
                "1919 1919 2 30 7 2 2 1 BST",
                "1919 1919 8 29 7 2 2 0 GMT",
                "1920 1920 2 28 7 2 2 1 BST",
                "1920 1920 9 25 7 2 2 0 GMT",
                "1921 1921 3 3 7 2 2 1 BST",
                "1921 1921 9 3 7 2 2 0 GMT",
                "1922 1922 2 26 7 2 2 1 BST",
                "1922 1922 9 8 7 2 2 0 GMT",
                "1923 1923 3 16 0 2 2 1 BST",
                "1923 1924 8 16 0 2 2 0 GMT",
                "1924 1924 3 9 0 2 2 1 BST",
                "1925 1926 3 16 0 2 2 1 BST",
                "1925 1938 9 2 0 2 2 0 GMT",
                "1927 1927 3 9 0 2 2 1 BST",
                "1928 1929 3 16 0 2 2 1 BST",
                "1930 1930 3 9 0 2 2 1 BST",
                "1931 1932 3 16 0 2 2 1 BST",
                "1933 1933 3 9 0 2 2 1 BST",
                "1934 1934 3 16 0 2 2 1 BST",
                "1935 1935 3 9 0 2 2 1 BST",
                "1936 1937 3 16 0 2 2 1 BST",
                "1938 1938 3 9 0 2 2 1 BST",
                "1939 1939 3 16 0 2 2 1 BST",
                "1939 1939 10 16 0 2 2 0 GMT",
                "1940 1940 1 23 0 2 2 1 BST",
                "1941 1941 4 2 0 1 2 2 BDST",
                "1941 1943 7 9 0 1 2 1 BST",
                "1942 1944 3 2 0 1 2 2 BDST",
                "1944 1944 8 16 0 1 2 1 BST",
                "1945 1945 3 2 1 1 2 2 BDST",
                "1945 1945 6 9 0 1 2 1 BST",
                "1945 1946 9 2 0 2 2 0 GMT",
                "1946 1946 3 9 0 2 2 1 BST",
                "1947 1947 2 16 7 2 2 1 BST",
                "1947 1947 3 13 7 1 2 2 BDST",
                "1947 1947 7 10 7 1 2 1 BST",
                "1947 1947 10 2 7 2 2 0 GMT",
                "1948 1948 2 14 7 2 2 1 BST",
                "1948 1948 9 31 7 2 2 0 GMT",
                "1949 1949 3 3 7 2 2 1 BST",
                "1949 1949 9 30 7 2 2 0 GMT",
                "1950 1952 3 14 0 2 2 1 BST",
                "1950 1952 9 21 0 2 2 0 GMT",
                "1953 1953 3 16 0 2 2 1 BST",
                "1953 1960 9 2 0 2 2 0 GMT",
                "1954 1954 3 9 0 2 2 1 BST",
                "1955 1956 3 16 0 2 2 1 BST",
                "1957 1957 3 9 0 2 2 1 BST",
                "1958 1959 3 16 0 2 2 1 BST",
                "1960 1960 3 9 0 2 2 1 BST",
                "1961 1963 2 0 8 2 2 1 BST",
                "1961 1968 9 23 0 2 2 0 GMT",
                "1964 1967 2 19 0 2 2 1 BST",
                "1968 1968 1 18 7 2 2 1 BST",
                "1972 1980 2 16 0 2 2 1 BST",
                "1972 1980 9 23 0 2 2 0 GMT",
                "1981 1995 2 0 8 1 1 1 BST",
                "1981 1989 9 23 0 1 1 0 GMT",
                "1990 1995 9 22 0 1 1 0 GMT"
            ],
            "EU": [
                "1977 1980 3 1 0 1 1 1 S",
                "1977 1977 8 0 8 1 1 0",
                "1978 1978 9 1 7 1 1 0",
                "1979 1995 8 0 8 1 1 0",
                "1981 9999 2 0 8 1 1 1 S",
                "1996 9999 9 0 8 1 1 0"
            ],
            "Spain": [
                "1917 1917 4 5 7 23 2 1 S",
                "1917 1919 9 6 7 23 2 0",
                "1918 1918 3 15 7 23 2 1 S",
                "1919 1919 3 5 7 23 2 1 S",
                "1924 1924 3 16 7 23 2 1 S",
                "1924 1924 9 4 7 23 2 0",
                "1926 1926 3 17 7 23 2 1 S",
                "1926 1929 9 1 6 23 2 0",
                "1927 1927 3 9 7 23 2 1 S",
                "1928 1928 3 14 7 23 2 1 S",
                "1929 1929 3 20 7 23 2 1 S",
                "1937 1937 4 22 7 23 2 1 S",
                "1937 1939 9 1 6 23 2 0",
                "1938 1938 2 22 7 23 2 1 S",
                "1939 1939 3 15 7 23 2 1 S",
                "1940 1940 2 16 7 23 2 1 S",
                "1942 1942 4 2 7 22 2 2 M",
                "1942 1942 8 1 7 22 2 1 S",
                "1943 1946 3 13 6 22 2 2 M",
                "1943 1943 9 3 7 22 2 1 S",
                "1944 1944 9 10 7 22 2 1 S",
                "1945 1945 8 30 7 1 0 1 S",
                "1946 1946 8 30 7 0 0 0",
                "1949 1949 3 30 7 23 0 1 S",
                "1949 1949 8 30 7 1 0 0",
                "1974 1975 3 13 6 23 0 1 S",
                "1974 1975 9 1 0 1 0 0",
                "1976 1976 2 27 7 23 0 1 S",
                "1976 1977 8 0 8 1 0 0",
                "1977 1978 3 2 7 23 0 1 S",
                "1978 1978 9 1 7 1 0 0"
            ],
            "France": [
                "1916 1916 5 14 7 23 2 1 S",
                "1916 1919 9 1 0 23 2 0",
                "1917 1917 2 24 7 23 2 1 S",
                "1918 1918 2 9 7 23 2 1 S",
                "1919 1919 2 1 7 23 2 1 S",
                "1920 1920 1 14 7 23 2 1 S",
                "1920 1920 9 23 7 23 2 0",
                "1921 1921 2 14 7 23 2 1 S",
                "1921 1921 9 25 7 23 2 0",
                "1922 1922 2 25 7 23 2 1 S",
                "1922 1938 9 1 6 23 2 0",
                "1923 1923 4 26 7 23 2 1 S",
                "1924 1924 2 29 7 23 2 1 S",
                "1925 1925 3 4 7 23 2 1 S",
                "1926 1926 3 17 7 23 2 1 S",
                "1927 1927 3 9 7 23 2 1 S",
                "1928 1928 3 14 7 23 2 1 S",
                "1929 1929 3 20 7 23 2 1 S",
                "1930 1930 3 12 7 23 2 1 S",
                "1931 1931 3 18 7 23 2 1 S",
                "1932 1932 3 2 7 23 2 1 S",
                "1933 1933 2 25 7 23 2 1 S",
                "1934 1934 3 7 7 23 2 1 S",
                "1935 1935 2 30 7 23 2 1 S",
                "1936 1936 3 18 7 23 2 1 S",
                "1937 1937 3 3 7 23 2 1 S",
                "1938 1938 2 26 7 23 2 1 S",
                "1939 1939 3 15 7 23 2 1 S",
                "1939 1939 10 18 7 23 2 0",
                "1940 1940 1 25 7 2 0 1 S",
                "1941 1941 4 5 7 0 0 2 M",
                "1941 1941 9 6 7 0 0 1 S",
                "1942 1942 2 9 7 0 0 2 M",
                "1942 1942 10 2 7 3 0 1 S",
                "1943 1943 2 29 7 2 0 2 M",
                "1943 1943 9 4 7 3 0 1 S",
                "1944 1944 3 3 7 2 0 2 M",
                "1944 1944 9 8 7 1 0 1 S",
                "1945 1945 3 2 7 2 0 2 M",
                "1945 1945 8 16 7 3 0 0",
                "1976 1976 2 28 7 1 0 1 S",
                "1976 1976 8 26 7 1 0 0"
            ],
            "C-Eur": [
                "1916 1916 3 30 7 23 0 1 S",
                "1916 1916 9 1 7 1 0 0",
                "1917 1918 3 15 1 2 2 1 S",
                "1917 1918 8 15 1 2 2 0",
                "1940 1940 3 1 7 2 2 1 S",
                "1942 1942 10 2 7 2 2 0",
                "1943 1943 2 29 7 2 2 1 S",
                "1943 1943 9 4 7 2 2 0",
                "1944 1945 3 1 1 2 2 1 S",
                "1944 1944 9 2 7 2 2 0",
                "1945 1945 8 16 7 2 2 0",
                "1977 1980 3 1 0 2 2 1 S",
                "1977 1977 8 0 8 2 2 0",
                "1978 1978 9 1 7 2 2 0",
                "1979 1995 8 0 8 2 2 0",
                "1981 9999 2 0 8 2 2 1 S",
                "1996 9999 9 0 8 2 2 0"
            ],
            "Italy": [
                "1916 1916 5 3 7 0 2 1 S",
                "1916 1916 9 1 7 0 2 0",
                "1917 1917 3 1 7 0 2 1 S",
                "1917 1917 8 30 7 0 2 0",
                "1918 1918 2 10 7 0 2 1 S",
                "1918 1919 9 1 0 0 2 0",
                "1919 1919 2 2 7 0 2 1 S",
                "1920 1920 2 21 7 0 2 1 S",
                "1920 1920 8 19 7 0 2 0",
                "1940 1940 5 15 7 0 2 1 S",
                "1944 1944 8 17 7 0 2 0",
                "1945 1945 3 2 7 2 0 1 S",
                "1945 1945 8 15 7 0 2 0",
                "1946 1946 2 17 7 2 2 1 S",
                "1946 1946 9 6 7 2 2 0",
                "1947 1947 2 16 7 0 2 1 S",
                "1947 1947 9 5 7 0 2 0",
                "1948 1948 1 29 7 2 2 1 S",
                "1948 1948 9 3 7 2 2 0",
                "1966 1968 4 22 0 0 0 1 S",
                "1966 1969 8 22 0 0 0 0",
                "1969 1969 5 1 7 0 0 1 S",
                "1970 1970 4 31 7 0 0 1 S",
                "1970 1970 8 0 8 0 0 0",
                "1971 1972 4 22 0 0 0 1 S",
                "1971 1971 8 0 8 1 0 0",
                "1972 1972 9 1 7 0 0 0",
                "1973 1973 5 3 7 0 0 1 S",
                "1973 1974 8 0 8 0 0 0",
                "1974 1974 4 26 7 0 0 1 S",
                "1975 1975 5 1 7 0 2 1 S",
                "1975 1977 8 0 8 0 2 0",
                "1976 1976 4 30 7 0 2 1 S",
                "1977 1979 4 22 0 0 2 1 S",
                "1978 1978 9 1 7 0 2 0",
                "1979 1979 8 30 7 0 2 0"
            ]
        },
        "links": {}
    });
});