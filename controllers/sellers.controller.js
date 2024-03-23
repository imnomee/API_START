import Seller from '../models/Seller.Model.js';
export const createSeller = async (req, res) => {
    const seller = await Seller.create(req.body);
    return res.status(200).json({ msg: 'seller created', seller });
};

export const getAllSellers = async (req, res) => {
    const sellers = await Seller.find();
    return res.status(200).json({ msg: 'sellers Found', sellers });
};

export const getSingleSeller = async (req, res) => {
    const sellers = await Seller.findById(req.params.id);
    return res.status(200).json({ msg: 'sellers Found', sellers });
};
