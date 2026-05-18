import { type Request, type Response } from 'express';
import Lead from '../models/Lead.js';

// --- CREATE LEAD ---
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lead', error });
  }
};

// --- GET ALL LEADS (With Search, Filter, Sort & Pagination) ---
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract Query Parameters
    const { status, source, search, sortBy, page = '1' } = req.query;

    // 2. Build the Query Object
    const query: any = {};

    // Exact match filters
    if (status) query.status = status;
    if (source) query.source = source;

    // Search filter (Regex on Name or Email)
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } }, // 'i' for case-insensitive
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    // 3. Sorting Logic ('Latest' vs 'Oldest')
    const sortParams: any = {};
    if (sortBy === 'Oldest') {
      sortParams.createdAt = 1; // Ascending
    } else {
      sortParams.createdAt = -1; // Descending (Latest - Default)
    }

    // 4. Pagination Logic (Mandatory limit: 10)
    const limit = 10;
    const pageNumber = parseInt(page as string, 10) || 1;
    const skip = (pageNumber - 1) * limit;

    // 5. Execute Database Queries
    const leads = await Lead.find(query).sort(sortParams).skip(skip).limit(limit);
    const totalRecords = await Lead.countDocuments(query);

    // 6. Return Data with Pagination Metadata
    res.status(200).json({
      data: leads,
      meta: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: pageNumber * limit < totalRecords,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error });
  }
};

// --- GET SINGLE LEAD ---
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lead', error });
  }
};

// --- UPDATE LEAD ---
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure enums are respected
    });
    
    if (!updatedLead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: 'Error updating lead', error });
  }
};

// --- DELETE LEAD ---
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error });
  }
};