import { Router } from 'express';
import { getCart, addToCart, deleteFromCart, checkoutCart } from '../services/cart.services.js';
import { verifyToken } from '../services/auth.services.js'; 

const router = Router();

router.get('/cart', verifyToken, getCart);
router.post('/cart', verifyToken, addToCart);
router.delete('/cart/:id', verifyToken, deleteFromCart);
router.post('/cart/checkout', verifyToken, checkoutCart);

export default router;