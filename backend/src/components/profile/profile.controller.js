const prisma = require('../../config/db.config');
const path = require('path');
const fs = require('fs');

exports.create = async (req, res) => {
    let profileImageName;
    let fnrcImageName;
    let bnrcImageName;
    let householdChartImageName;
    let recommendationImageName;

    try {
        if (!req.files) {
            await prisma.tbl_profile.create({
                data: {
                    ...req.body,
                    employeeID: Number(req.body.employeeID),
                    married: Boolean(JSON.parse(req.body.married)),
                },
            }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            return res.status(201).json({ message: 'Profile has been created successfully' });
        }

        if (req.files.profile_image) {
            const profileImage = req.files.profile_image;
            profileImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${profileImage.name}`;

            await profileImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName));
        }

        if (req.files.FNRC_img) {
            const fnrcImage = req.files.FNRC_img;
            fnrcImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${fnrcImage.name}`;

            await fnrcImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName));
        }

        if (req.files.BNRC_img) {
            const bnrcImage = req.files.BNRC_img;
            bnrcImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${bnrcImage.name}`;

            await bnrcImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName));
        }

        if (req.files.recommendation_img) {
            const recommendationImage = req.files.recommendation_img;
            recommendationImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${recommendationImage.name}`;

            await recommendationImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName));
        }

        if (req.files.household_chart_img) {
            const householdChartImage = req.files.household_chart_img;
            householdChartImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${householdChartImage.name}`;

            await householdChartImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'household-chart', householdChartImageName));
        }

        await prisma.tbl_profile
            .create({
                data: {
                    ...req.body,
                    employeeID: Number(req.body.employeeID),
                    married: Boolean(JSON.parse(req.body.married)),
                    profile_image: profileImageName,
                    FNRC_img: fnrcImageName,
                    BNRC_img: bnrcImageName,
                    recommendation_img: recommendationImageName,
                    household_chart_img: householdChartImageName,
                },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        return res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        if (profileImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName));
        }

        if (fnrcImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName));
        }

        if (bnrcImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName));
        }

        if (recommendationImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName));
        }

        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    let profileImageName;
    let fnrcImageName;
    let bnrcImageName;
    let householdChartImageName;
    let recommendationImageName;

    try {
        const id = req.params.id;

        const existingProfile = await prisma.tbl_profile.findUnique({ where: { employeeID: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        if (!existingProfile) {
            throw new Error('Profile not found');
        }

        if (!req.files) {
            await prisma.tbl_profile.update({
                where: { employeeID: Number(id) },
                data: {
                    ...req.body,
                    employeeID: Number(req.body.employeeID),
                    married: Boolean(JSON.parse(req.body.married)),
                },
            }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            return res.status(200).json({ message: 'Profile has been updated successfully' });
        }


        if (req.files.profile_image) {
            const profileImage = req.files.profile_image;
            profileImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${profileImage.name}`;

            if (existingProfile.profile_image && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', existingProfile.profile_image))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', existingProfile.profile_image));
            }

            await profileImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName));
        }

        if (req.files.FNRC_img) {
            const fnrcImage = req.files.FNRC_img;
            fnrcImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${fnrcImage.name}`;

            if (existingProfile.FNRC_img && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', existingProfile.FNRC_img))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', existingProfile.FNRC_img));
            }

            await fnrcImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName));
        }

        if (req.files.BNRC_img) {
            const bnrcImage = req.files.BNRC_img;
            bnrcImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${bnrcImage.name}`;

            if (existingProfile.BNRC_img && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', existingProfile.BNRC_img))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', existingProfile.BNRC_img));
            }

            await bnrcImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName));
        }

        if (req.files.recommendation_img) {
            const recommendationImage = req.files.recommendation_img;
            recommendationImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${recommendationImage.name}`;

            if (existingProfile.recommendation_img && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', existingProfile.recommendation_img))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', existingProfile.recommendation_img));
            }

            await recommendationImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName));
        }

        if (req.files.household_chart_img) {
            const householdChartImage = req.files.household_chart_img;
            householdChartImageName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${householdChartImage.name}`;

            if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'household-chart', existingProfile.household_chart_img))) {
                fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'household-chart', existingProfile.household_chart_img));
            }

            await householdChartImage.mv(path.join(__dirname, '..', '..', '..', 'public', 'household-chart', householdChartImageName));
        }

        await prisma.tbl_profile
            .update({
                where: { employeeID: Number(id) },
                data: {
                    ...req.body,
                    employeeID: Number(req.body.employeeID),
                    married: Boolean(JSON.parse(req.body.married)),
                    profile_image: profileImageName,
                    FNRC_img: fnrcImageName,
                    BNRC_img: bnrcImageName,
                    recommendation_img: recommendationImageName,
                    household_chart_img: householdChartImageName,
                },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        return res.status(200).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.log(error);

        if (profileImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'Profile', profileImageName));
        }

        if (fnrcImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'FNRC', fnrcImageName));
        }

        if (bnrcImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'BNRC', bnrcImageName));
        }

        if (recommendationImageName && fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName))) {
            fs.rmSync(path.join(__dirname, '..', '..', '..', 'public', 'recomendation', recommendationImageName));
        }

        res.status(500).json({ error: error.message });
    }
};

exports.search = async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const profile = await prisma.tbl_profile.findUnique({ where: { employeeID: Number(id) } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!profile) {
                throw new Error('This ID not set profile.');
            }

            return res.status(200).json({ data: profile });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
