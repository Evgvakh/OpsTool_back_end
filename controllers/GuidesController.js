import Guide from "../DB/Models/Guide.js";

export const addNewGuide = async (req, res) => {    
    try {
        const { firstName, lastName, residence, phone, email, languages } = req.body
        const isExistingGuide = await Guide.findOne({firstName: firstName, lastName: lastName})

        if(isExistingGuide) {     
            throw new Error('Guide already exists')
        }
        const document = new Guide({
            firstName: firstName,
            lastName: lastName,
            residence: residence,
            phone: phone,
            email: email,
            languages: languages
        })
        await document.save()
        res.status(201).json(document)
    } catch (err) {
        console.log(err);
        res.status(400).send({errorMessage: err.message, data: null})
    }
}

export const getAllGuides = async (req, res) => {
    try {
        const data = await Guide.find().sort({ lastName: 1 })
        res.json(data)
    } catch (err) {
        console.log(err); 
        res.status(400).send(err)
    }
}

export const findGuideByID = async (req, res) => {
    try {
        const data = await Guide.findById(req.params.id)
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}
export const addGuideBooking = async (req, res) => {
    try {
        const data = await Guide.updateOne(
            { _id: req.body.id },
            { $push: { bookings: { callId: req.body.callID, callDate: req.body.callDate } } }
        );
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

export const removeGuideBooking = async (req, res) => {    
    try {
        const data = await Guide.updateOne(
            { _id: req.body.guideID },
            { $pull: { bookings: { callId: req.body.callID } } }
        )
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

export const addGuideLanguage = async (req, res) => {    
    const { id, languages } = req.body;    
    
    if (!Array.isArray(languages)) {
        return res.status(400).json({ error: "Must be array" });
    }

    try {
        const data = await Guide.findByIdAndUpdate(
            id,
            {$set: { languages: languages }},
            { new: true }
        );
        if (!data) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

export const addGuideTextField = async (req, res) => {
    try {
        const allowedFields = ["lastName", "firstName", "phone", "email", "residence"];
        if (!allowedFields.includes(req.body.field)) {
            return res.status(400).json({ error: "Field is not existing" });
        }
        const data = await Guide.updateOne(
            { _id: req.body.id },
            { [req.body.field]: req.body.value }
        );
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

export const addGuideWorkedHours = async (req, res) => {
    try {
        const guide = await Guide.findById(req.body.id)
        if (guide.workedHours.some(el => el.callId == req.body.callID)) {
            const index = guide.workedHours.findIndex(el => el.callId == req.body.callID)
            if (req.body.hours == 'N/A') {
                const data = await Guide.updateOne(
                    { _id: req.body.id },
                    { $pull: { workedHours: { callId: req.body.callID } } }
                )
                res.status(201).json(data)
            } else {
                guide.workedHours[index].hours = req.body.hours
                const data = await guide.save()
                res.status(201).json(data)
            }
        } else {
            if (req.body.hours != 'N/A') {
                const data = await Guide.updateOne(
                    { _id: req.body.id },
                    { $push: { workedHours: { callId: req.body.callID, hours: req.body.hours } } }
                );
                res.json(data)
            } else {
                res.status(200).send('Invalid status')
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}

export const removeAllGuidesBookings = async (req, res) => {
    const guides = await Guide.updateMany({}, {$set: {bookings: []}})
    res.send(guides)
}


