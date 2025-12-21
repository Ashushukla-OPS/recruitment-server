import skillService from "../services/skill.service.js";

class SkillController {
    async createSkill(req, res, next) {
        try {
            const skill = await skillService.createSkill(req.body);
            res.status(201).json({ success: true, data: skill });
        } catch (error) {
            next(error);
        }
    }

    async getSkill(req, res, next) {
        try {
            const skill = await skillService.getSkillById(req.params.id);
            res.status(200).json({ success: true, data: skill });
        } catch (error) {
            next(error);
        }
    }

    async getAllSkills(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await skillService.getAllSkills(page, limit);
            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSkill(req, res, next) {
        try {
            const updatedSkill = await skillService.updateSkill(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedSkill });
        } catch (error) {
            next(error);
        }
    }

    async deleteSkill(req, res, next) {
        try {
            await skillService.deleteSkill(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async searchSkills(req, res, next) {
        try {
            const nameQuery = req.query.name;
            const skills = await skillService.searchSkillsByName(nameQuery);
            res.status(200).json({ success: true, skills: skills });
        } catch (error) {
            next(error);
        }
    }
}

export default new SkillController();
