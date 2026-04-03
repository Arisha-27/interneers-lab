from flask import Blueprint, jsonify, request, current_app

product_bp = Blueprint("products", __name__, url_prefix="/api/products")


def get_service():
    return current_app.config["PRODUCT_SERVICE"]


@product_bp.route("/", methods=["GET"])
def get_all():
    category_id = request.args.get("category_id")
    service = get_service()
    if category_id:
        products = service.get_products_by_category(category_id)
    else:
        products = service.get_all_products()
    return jsonify([vars(p) for p in products]), 200


@product_bp.route("/<product_id>", methods=["GET"])
def get_one(product_id):
    service = get_service()
    try:
        product = service.get_product_by_id(product_id)
        return jsonify(vars(product)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@product_bp.route("/", methods=["POST"])
def create():
    service = get_service()
    body = request.get_json()
    if not body:
        return jsonify({"error": "Request body required"}), 400
    try:
        product = service.create_product(
            name=body.get("name", ""),
            price=body.get("price", 0),
            category_id=body.get("category_id", ""),
            stock=body.get("stock", 0),
        )
        return jsonify(vars(product)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@product_bp.route("/<product_id>", methods=["PUT"])
def update(product_id):
    service = get_service()
    body = request.get_json()
    if not body:
        return jsonify({"error": "Request body required"}), 400
    try:
        updated = service.update_product(product_id, body)
        return jsonify({"updated": updated}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@product_bp.route("/<product_id>", methods=["DELETE"])
def delete(product_id):
    service = get_service()
    try:
        deleted = service.delete_product(product_id)
        return jsonify({"deleted": deleted}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404