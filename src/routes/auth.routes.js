const express = require("express");

const router = express.Router();

const {
  registerStepOne,
  registerStepTwo,
  registerStepThree,
  completeRegistration,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile
} = require("../controllers/auth.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication & Registration APIs
 */

/**
 * @swagger
 * /api/auth/register-step-1:
 *   post:
 *     summary: Registration Step 1 - Basic Details
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Step 1 completed
 */
router.post(
  "/register-step-1",
  registerStepOne
);

/**
 * @swagger
 * /api/auth/register-step-2:
 *   post:
 *     summary: Registration Step 2 - Select Branch
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               draftId:
 *                 type: string
 *               branchId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step 2 completed
 */
router.post(
  "/register-step-2",
  registerStepTwo
);

/**
 * @swagger
 * /api/auth/register-step-3:
 *   post:
 *     summary: Registration Step 3 - Select Subscription
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               draftId:
 *                 type: string
 *               subscriptionPlanId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step 3 completed
 */
router.post(
  "/register-step-3",
  registerStepThree
);

/**
 * @swagger
 * /api/auth/complete-registration:
 *   post:
 *     summary: Complete User Registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               draftId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration completed
 */
router.post(
  "/complete-registration",
  completeRegistration
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  login
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Generate New Access Token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 */
router.post(
  "/refresh-token",
  refreshToken
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout User
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  "/logout",
  logout
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get Logged In User Profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get(
  "/profile",
  protect,
  getProfile
);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update Logged In User Profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nishikant Sahoo
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               branchId:
 *                 type: string
 *                 example: "685f1234567890abcdef1234"
 *               subscriptionPlanId:
 *                 type: string
 *                 example: "685f9876543210abcdef5678"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;