import Call from "../DB/Models/Call.js";

export const addCall = async (req, res) => {
    try {        
        const data = new Call({
            date: req.body.date,
            port: req.body.port,
            company: req.body.company,
            ship: req.body.ship,
            arrival: req.body.arrival,
            departure: req.body.departure
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

// OLD SCHEMA //
// export const getCalls = async (req, res) => {
//     try {
//         const data = await Call.find({}).sort({date: 1})
//         res.send(data)
//     } catch (err) {
//         console.log(err);
//         res.status(400).send(err)
//     }
// }

export const getCalls = async (req, res) => {
    try {
        const calls = await Call.aggregate([
            {
                $lookup: {
                    from: 'ports',
                    localField: 'port',
                    foreignField: 'name',
                    as: 'portDetails'
                }
            },
            {
                $unwind: {
                    path: '$portDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    portCode: '$portDetails.code'
                }
            },
            {
                $project: {
                    portDetails: 0
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ])
        res.status(200).send(calls)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}