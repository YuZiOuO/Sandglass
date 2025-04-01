# API invariant

## 1

if a document is list referenced:
C,R:should be down under a valid object it attaches to.
U,D:should be down only by id.

## 2

if status code clearly indicates the error,
the response body should be empty, i.e `(b'')`.

## 3

Do not return object with some fields missing.
Only return a full object or a list of object id.
