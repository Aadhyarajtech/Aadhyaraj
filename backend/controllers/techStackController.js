const TechStack = require('../models/TechStack');

const normalizeTechnologies = (technologies) => {
  if (!Array.isArray(technologies)) return [];
  return technologies
    .map((tech) => {
      if (!tech) return null;
      if (typeof tech === 'string') {
        return { name: tech, icon: '🔧', description: '' };
      }
      if (tech.name) {
        return {
          name: tech.name,
          icon: tech.icon || '🔧',
          description: tech.description || ''
        };
      }
      return null;
    })
    .filter(Boolean);
};

const normalizeTechItem = (item) => {
  const raw = item.toObject ? item.toObject() : item;
  const technologies = Array.isArray(raw.technologies) && raw.technologies.length > 0
    ? normalizeTechnologies(raw.technologies)
    : raw.name
      ? normalizeTechnologies([{ name: raw.name, icon: raw.icon, description: raw.description }])
      : [];

  return { ...raw, technologies };
};

// GET /api/techstack — public, returns active items
const getTechStack = async (req, res) => {
  try {
    const items = await TechStack.find({ isActive: true }).sort({ order: 1, category: 1 });
    res.json({ success: true, data: items.map(normalizeTechItem) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/techstack/admin/all — admin, returns all items
const getAllTechStack = async (req, res) => {
  try {
    const items = await TechStack.find().sort({ order: 1, category: 1 });
    res.json({ success: true, data: items.map(normalizeTechItem) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/techstack/:id
const getTechItem = async (req, res) => {
  try {
    const item = await TechStack.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Tech item not found' });
    res.json({ success: true, data: normalizeTechItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/techstack — admin
const createTechItem = async (req, res) => {
  try {
    const { category, order, isActive, technologies, name, icon, description } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const techItems = normalizeTechnologies(Array.isArray(technologies) ? technologies : technologies?.split?.('\n') || []);
    if (techItems.length === 0 && name) {
      techItems.push({ name, icon: icon || '🔧', description: description || '' });
    }

    const item = await TechStack.create({ category, order, isActive, technologies: techItems });
    res.status(201).json({ success: true, data: normalizeTechItem(item), message: 'Tech category created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/techstack/:id — admin
const updateTechItem = async (req, res) => {
  try {
    const { category, order, isActive, technologies, name, icon, description } = req.body;
    const techItems = normalizeTechnologies(Array.isArray(technologies) ? technologies : technologies?.split?.('\n') || []);
    if (techItems.length === 0 && name) {
      techItems.push({ name, icon: icon || '🔧', description: description || '' });
    }

    const item = await TechStack.findByIdAndUpdate(
      req.params.id,
      { category, order, isActive, technologies: techItems },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Tech item not found' });
    res.json({ success: true, data: normalizeTechItem(item), message: 'Tech category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/techstack/:id — admin
const deleteTechItem = async (req, res) => {
  try {
    const item = await TechStack.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Tech item not found' });
    res.json({ success: true, message: 'Tech item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getTechStack, getAllTechStack, getTechItem, createTechItem, updateTechItem, deleteTechItem };
