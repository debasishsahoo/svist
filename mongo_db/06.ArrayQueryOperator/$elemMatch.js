db.products.find({
    storage: {
        $elemMatch: {
            $lt: 128
        }
    }
})