import Comment from "../DB/Models/Comment.js";

export const addComment = async (req, res) => {
    try {
        const isExisting = await Comment.findOne({ callID: req.body.callID, guideID: req.body.guideID })
        if (!isExisting) {
            const comment = new Comment({
                callID: req.body.callID,
                guideID: req.body.guideID,
                text: req.body.text
            })
            const data = await comment.save()
            res.json(data)
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: err })
    }
}

export const editComment = async (req, res) => {
    try {
        const isExisting = await Comment.findOne({ callID: req.body.callID, guideID: req.body.guideID })
        if (isExisting) {
            if (req.body.text.length > 0) {
                const comment = await Comment.updateOne(
                    { _id: isExisting._id },
                    { text: req.body.text }
                )
                res.json(comment)
            } else {
                const comment = await Comment.deleteOne(
                    { _id: isExisting._id }                    
                )
                res.json(comment)
            }            
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: err })
    }
}

export const getComments = async (req, res) => {
    try {
        const data = await Comment.find()
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: err })
    }
}