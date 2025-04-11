import oss2
from flask import Flask, current_app
from oss2 import StaticCredentialsProvider, Bucket
from oss2.exceptions import NoSuchBucket


def initialize_oss(app: Flask):

    # Get the required environment variables
    auth = oss2.ProviderAuthV4(
        StaticCredentialsProvider(
            current_app.config["OSS_ACCESS_KEY_ID"],
            current_app.config["OSS_ACCESS_KEY_SECRET"]
        )
    )

    # Create bucket if not exists
    bucket = oss2.Bucket(
        auth,
        endpoint=current_app.config["OSS_ENDPOINT"],
        bucket_name=current_app.config["OSS_BUCKET_NAME"],
        region=current_app.config["OSS_REGION"]
    )

    try:
        bucket.get_bucket_info()
    except NoSuchBucket:
        bucket.create_bucket()

    return bucket


def get_bucket() -> Bucket:
    bkt = initialize_oss(current_app)
    while True:
        yield bkt
