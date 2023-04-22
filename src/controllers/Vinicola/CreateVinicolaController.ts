import { Request, Response } from "express";
import { CreateVinicolaService } from "../../services/Vinicola/CreateVinicolaService";
import { AppDataSource } from "../../data-source";

export class CreateVinicolaController {
    async handle(request: Request, response: Response) {
        const { name, description, image, category_id } = request.body;

        const service = new CreateVinicolaService();

        const dataSource = AppDataSource;

        const result = await service.execute({ name, description, image, category_id }, dataSource);

        if (result instanceof Error) {
            return response.status(400).json({ error: result.message });
        }

        return response.json(result);
    }
}