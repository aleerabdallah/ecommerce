import logging



logger = logging.getLogger(__file__)

logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.DEBUG)



class TokenExistMiddleWare:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        token = request.headers.get('Authorization')
        if token is not None:
            logger.info("Token Exists")
        else:
            logger.info("Token doesn't exist")

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
