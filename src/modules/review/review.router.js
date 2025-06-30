import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { addReview } from "./review.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { addReviewVlidation } from "./review.validation.js";


const router = Router({ mergeParams: true });

router.post('/' ,isAuthentication,isValid(addReviewVlidation), addReview)

export default router;
