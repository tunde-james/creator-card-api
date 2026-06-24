const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator_cards';

const schemaConfig = {
  _id: { type: SchemaTypes.ULID },
  title: { type: SchemaTypes.String, index: true },
  description: { type: SchemaTypes.String },
  slug: { type: SchemaTypes.String, unique: true, index: true },
  creator_reference: { type: SchemaTypes.String, index: true },
  links: [
    {
      title: { type: SchemaTypes.String },
      url: { type: SchemaTypes.String },
    },
  ],
  service_rates: {
    currency: { type: SchemaTypes.String },
    rates: [
      {
        name: { type: SchemaTypes.String },
        description: { type: SchemaTypes.String },
        amount: { type: SchemaTypes.Number },
      },
    ],
  },
  status: { type: SchemaTypes.String, index: true },
  access_type: { type: SchemaTypes.String, default: 'public', index: true },
  access_code: { type: SchemaTypes.String },
  created: { type: SchemaTypes.Number, index: true },
  updated: { type: SchemaTypes.Number },
  deleted: { type: SchemaTypes.Number, default: 0, index: true },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });

modelSchema.index({ slug: 1, deleted: 1 }, { unique: true });

module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });