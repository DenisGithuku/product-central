const {Query} = require("mongoose");

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    filter() {
        let queryObj = {...this.queryStr}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace((/\b(gte|gt|lte|lt)\b/g), match => `$${match}`)
        const filterObj = JSON.parse(queryStr)
        this.query = this.query.find(filterObj)
        return this
    }

    sort() {
        if (this.queryStr.sort) {
            let sortBy = this.queryStr.sort.split(',').join(' ')
            if (sortBy) {
                this.query = this.query.sort(sortBy)
            }
        } else {
            this.query = this.query.sort('-price')
        }
        return this
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = parseInt(this.queryStr.page) || 1
        const limit = parseInt(this.queryStr.limit) || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = ApiFeatures