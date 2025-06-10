import Joi from "joi";


export const createOrderSchema = Joi.object({
    address: Joi.string().required(),
    phone: Joi.string().required(),
    coupon: Joi.string().length(5),
    payment: Joi.string().valid('cash', 'visa').required(),
    
}).required()