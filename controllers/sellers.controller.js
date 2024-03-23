import Seller from '../models/Seller.Model.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/custom.errors.js';

export const createSeller = async (req, res) => {
    const seller = await Seller.create(req.body);
    return res
        .status(StatusCodes.CREATED)
        .json({ msg: 'seller created', seller });
};

export const getAllSellers = async (req, res) => {
    const sellers = await Seller.find();
    return res.status(StatusCodes.OK).json({ msg: 'sellers Found', sellers });
};

export const getSingleSeller = async (req, res) => {
    const seller = await Seller.findById(req.params.id);
    if (!seller) throw new NotFoundError(`No item with id: ${req.params.id}`);
    return res.status(StatusCodes.OK).json({ msg: 'sellers Found', seller });
};
