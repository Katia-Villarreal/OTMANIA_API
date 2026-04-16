import pg from "pg";

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUGDycYqHvye/gpdrs6GpB1VlSqvwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZjEzZTU4ZWUtYjdmYS00YmU4LTk4Y2ItNzJjMGY2YTlh
MDkwIFByb2plY3QgQ0EwHhcNMjYwMjI0MjMzOTEzWhcNMzYwMjIyMjMzOTEzWjA6
MTgwNgYDVQQDDC9mMTNlNThlZS1iN2ZhLTRiZTgtOThjYi03MmMwZjZhOWEwOTAg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAN7/7KmB
9zZ0f0mlzOqvWh8iDAc3n8X46HLd5Xk04dBEfJhGaryr03/yKaNKB8yx73CXjdQc
8LHzJqQJMs1SvRqpFxgeT8I8Xo0pET7uG5Eee601j6ncFgvJetMHrSY4jwXVxHHi
AJu/23PI0m8BxL9oxXgJUay87X4+r0T++4hHno3N9l6ivDd5hPwXxLSCTM8zTl3l
8tk1uivrhDemP0byKMOCr2kz6xACPHwBAuauiDS3h1X5lKIRJQ9SWog8ogBN5tgT
JKkxFR7YWBbxFQBpox4pJ8OnxsHMQxEUcXmlzCyZGZ3TqR6SrZMAUSxT7k9DRuiB
v0HaSr8NNFZF3jJdy6RdehkjOQ+Lwq0WBNcq7EWSWOsUFu2Wxu47nTJmXJX8r+xN
jA3FTM3NjnFcOovCbuKbVsIdWtwu3tsiJeMSSCakS3djZ+ovf5/d9WkUuo8M+3GJ
cFH/F0Wv+pRaveu0QLunfQa7km8bxwBkUeJk4PT0Gwn+ad9W1aq3yWWNAwIDAQAB
o0IwQDAdBgNVHQ4EFgQUKGkS/eTr2GCSWGMePLMGzeV1oHUwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAIvjgbRDVd04
myMfB3PO7CRH/yI5RwJLWOQtLTvpWcEXb3kZByb2Yog4HtAUdrfb6cgxY65a/uik
HJIAAGsFMTN/CK1w+iT7PFHQdgWqYEYJCh+V8xoDAjxfuloLgtL8X3hJtaaXc0aN
ARxyhnlGx8sVM1IkNbhVpLbl4yKkGOgD67umrxeJ8skMI0y2GZmHSaF7znaIsGAr
zLpElOvDlyvlx9dstKXecthj+rlfBMEPgZP8XirKIGRIXq2MAnpcQSn8yunKNDOr
BYPrkKnW4hEZYchq/xyM+wZMP+lKkKJhaYaoROpfAwI2eWznWECC88v7dBINCL9o
7OQPdSqBcpCyaAmJG7YlMWiS0kGEI0nhIrwLIXYK09BotzQX1jCzHNRGVyBS+fwM
+nmNvxT5Qk8TZzO3FX2OfUi3/eW6X3BKayObfM3tb18BXTA0rYJYAafIKTUFW/Hf
rdpEuvwWlG60jz8KJ37Yp1zTgTsD8CqG3/oKeFi86oGXXs80rVSQCQ==
-----END CERTIFICATE-----`,
    },
};

export function db_connect() {
    const client = new pg.Client(config);
    client.connect();
    return client;
}