const httpStatus = require('http-status');
const Apart = require('../models/apart');
const ApiError = require('../models/error');

const load = async (req, _, next, id) => {
  try {
    const apart = await Apart.get(id);
    if (!apart) {
      next(
        new ApiError({
          status: httpStatus.NOT_FOUND,
          message: 'Apartment realtor does not exist.',
        }),
      );
      return;
    }
    req.locals = { apart };
    next();
  } catch (error) {
    next(error);
  }
};

const createApart = (req, res, next) => {
  new Apart({ ...req.body, realtor: req.user._id })
    .save()
    .then(({ _doc: apart }) => res.status(httpStatus.CREATED).send({ apart }))
    .catch(err => next(err));
};

const readAparts = async (req, res, next) => {
  const { role } = req.user;
  try {
    const aparts = await Apart.find(role === 1 ? { status: true } : {})
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.skip, 10))
      .exec();

    res.send({ aparts: aparts.map(({ _doc }) => _doc) });
  } catch (err) {
    next(err);
  }
};

const updateApart = (req, res, next) => {
  const preApart = Object.assign(req.locals.apart, req.body);

  preApart
    .save()
    .then(({ _doc: apart }) => res.send({ apart }))
    .catch(err => next(err));
};

const deleteApart = (req, res, next) => {
  req.locals.apart
    .remove()
    .then(_ => res.status(httpStatus.NO_CONTENT).end())
    .catch(err => next(err));
};

module.exports = { load, createApart, readAparts, updateApart, deleteApart };
