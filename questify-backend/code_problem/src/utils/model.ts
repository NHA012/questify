import { Model, ModelStatic, WhereOptions, Attributes } from 'sequelize';

export async function softDelete<M extends Model>(
  model: ModelStatic<M>,
  where: WhereOptions<Attributes<M>>,
): Promise<void> {
  await model.update({ isDeleted: true }, { where });
}
