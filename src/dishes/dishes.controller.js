const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function create(req, res) {
    const {data: {name, description, price, image_url} = {}} = req.body
    const newDish = {
        name,
        description,
        price,
        image_url,
        id: nextId
    }
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}

function hasName(req, res, next) {
const {data: {name} = {}} = req.body
if(name) {
    return next()
}
next ({
    status: 400,
    message: "Dish must include a name"
})
}
function hasDescription(req, res, next) {
    const {data: {description} = {}} = req.body
    if (description) {
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a description"
    })
}

function hasPrice(req, res, next) {
    const {data: {price} = {}} = req.body
    if (price) {
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a price"
    })
}
function hasValidPrice(req, res, next) {
    const {data: {price} = {}} = req.body
    if (price > -1) {
        res.locals.price = price
        return next()
    } else {
        next({
            status: 400,
            message: "price cannot be less than 0."
        })
    }

}


function hasImg(req, res, next) {
    const {data: {image_url} = {}} = req.body
    if (image_url) {
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a image_url"
    })
}

function dishExists(req, res, next) {
    const dishId = Number(req.params.dishId)
    const foundDish = dishes.find((dish) => dish.id === dishId)
    if (foundDish) {
        res.locals.dish = foundDish
        return next()
    }
    next({
        status: 404,
        message: `dish id not found ${req.params.dishId}`
    })
}

function update(req, res, next) {
    const foundDish = res.locals.dish
    const {data: {name, description, price, image_url} = {}} = req.body
    foundDish.name = name
    foundDish.description = description
    foundDish.price = price
    foundDish.image_url = image_url
    res.json({data: foundDish})
}

function read(req, res, next) {
    res.json({data: res.locals.dis})
}

function list(req, res, next) {
    res.json({data: dishes})
}

module.exports = {
    create: [hasValidPrice, hasDescription, hasImg, hasName, hasPrice, create], 
    list,
    read: [read, dishExists],
    update: [dishExists, hasImg, hasName,hasPrice, hasDescription, update],
    dishExists
}