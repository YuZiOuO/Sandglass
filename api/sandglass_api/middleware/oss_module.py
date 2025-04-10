import oss2
from oss2 import StaticCredentialsProvider, Bucket
from oss2.exceptions import NoSuchBucket

from sandglass_api.config import OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_REGION, OSS_BUCKET_NAME, OSS_ENDPOINT


def init_oss():
    # Get the required environment variables
    auth = oss2.ProviderAuthV4(StaticCredentialsProvider(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET))

    # Create bucket if not exists
    bucket = oss2.Bucket(auth, endpoint=OSS_ENDPOINT,
                         bucket_name=OSS_BUCKET_NAME, region=OSS_REGION)
    try:
        bucket.get_bucket_info()
    except NoSuchBucket:
        bucket.create_bucket()

    return bucket


def get_bucket() -> Bucket:
    bkt = init_oss()
    while True:
        yield bkt
