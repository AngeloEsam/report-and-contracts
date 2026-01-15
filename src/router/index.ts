import { Router } from 'express';
import contractsController from '../controllers/contracts.controller';

const router = Router();

// Contract 1: Unified Maintenance Contract
router.post('/1/generate', (req, res) => contractsController.generateContract1(req, res));

// Contract 2: Fire Extinguisher Maintenance Contract
router.post('/2/generate', (req, res) => contractsController.generateContract2(req, res));

// Contract 3: Technical Inspection Report
router.post('/3/generate', (req, res) => contractsController.generateContract3(req, res));

// Contract 4: Fire Extinguisher Repair Quotation
router.post('/4/generate', (req, res) => contractsController.generateContract4(req, res));

// Contract 5: Safety Systems Repair Quotation
router.post('/5/generate', (req, res) => contractsController.generateContract5(req, res));

// Contract 6: Fire Extinguisher Delivery Receipt (After Maintenance)
router.post('/6/generate', (req, res) => contractsController.generateContract6(req, res));

// Contract 7: Fire Extinguisher Receipt (Before Maintenance)
router.post('/7/generate', (req, res) => contractsController.generateContract7(req, res));

export default router;
