from flask import Blueprint, request

attachment_api = Blueprint('attachment_api', __name__)


@attachment_api.get('/<str:proj_id>/atmt')
def get_attachment(proj_id: str):
    pass


@attachment_api.post('/<str:proj_id>/atmt')
def create_attachment(proj_id: str):
    json = request.json


@attachment_api.put('/<str:proj_id>/atmt/<str:atmt_id>')
def get_upload_sign_url():
    pass


@attachment_api.get('/<str:proj_id>/atmt/<str:atmt_id>')
def get_download_sign_url():
    pass


@attachment_api.get('/<str:proj_id>/atmt/<str:atmt_id>/v')
def get_history_versions():
    pass


@attachment_api.get('/<str:proj_id>/atmt/<str:atmt_id>/v/<str:version_id>')
def get_history_version_download_sign_url():
    pass
