const express =
require("express");

const router =
express.Router();

const {
 protect
}
=
require(
"../middleware/auth.middleware"
);

const {
 authorize
}
=
require(
"../middleware/role.middleware"
);

const validate =
require(
"../middleware/validate.middleware"
);

const {
 createDietProgressSchema,
 updateDietProgressSchema
}
=
require(
"../validators/dietProgress.validator"
);

const {

 createProgress,

 updateProgress,

 deleteProgress,

 getMyProgress,

 getUserProgress,

 getWeeklyProgress,

 getMonthlyProgress,

 getGraphData,

 getDashboardSummary

}
=
require(
"../controllers/dietProgress.controller"
);

/**
 * @swagger
 * tags:
 *   name: Diet Progress
 *   description: Diet Progress Tracking, Analytics & Dashboard APIs
 */

/**
 * @swagger
 * /api/diet-progress:
 *   post:
 *     summary: Create Diet Progress Entry
 *     description: Logs a new diet progress entry. Users can log their own progress; admins/trainers can log progress on behalf of any user.
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - currentWeight
 *             properties:
 *               userId:
 *                 type: string
 *               userDietId:
 *                 type: string
 *               dietTemplateId:
 *                 type: string
 *               goalGroupId:
 *                 type: string
 *               startingWeight:
 *                 type: number
 *               currentWeight:
 *                 type: number
 *               targetWeight:
 *                 type: number
 *               height:
 *                 type: number
 *               caloriesTarget:
 *                 type: number
 *               proteinTarget:
 *                 type: number
 *               carbsTarget:
 *                 type: number
 *               fatTarget:
 *                 type: number
 *               caloriesConsumed:
 *                 type: number
 *               waterIntake:
 *                 type: number
 *               breakfastCompleted:
 *                 type: boolean
 *               lunchCompleted:
 *                 type: boolean
 *               dinnerCompleted:
 *                 type: boolean
 *               workoutCompletionPercent:
 *                 type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [before, after]
 *                     url:
 *                       type: string
 *                     note:
 *                       type: string
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diet progress created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 */
router.post(
"/",
protect,
validate(createDietProgressSchema),
createProgress
);

/**
 * @swagger
 * /api/diet-progress/{id}:
 *   put:
 *     summary: Update Diet Progress Entry
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentWeight:
 *                 type: number
 *               targetWeight:
 *                 type: number
 *               caloriesConsumed:
 *                 type: number
 *               waterIntake:
 *                 type: number
 *               breakfastCompleted:
 *                 type: boolean
 *               lunchCompleted:
 *                 type: boolean
 *               dinnerCompleted:
 *                 type: boolean
 *               workoutCompletionPercent:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Diet progress updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Diet progress not found
 */
router.put(
"/:id",
protect,
validate(updateDietProgressSchema),
updateProgress
);

/**
 * @swagger
 * /api/diet-progress/{id}:
 *   delete:
 *     summary: Delete Diet Progress Entry
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diet progress deleted successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Diet progress not found
 */
router.delete(
"/:id",
protect,
deleteProgress
);

/**
 * @swagger
 * /api/diet-progress/my:
 *   get:
 *     summary: Get My Diet Progress (paginated, filterable, searchable, sortable)
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused, cancelled]
 *       - in: query
 *         name: userDietId
 *         schema:
 *           type: string
 *       - in: query
 *         name: dietTemplateId
 *         schema:
 *           type: string
 *       - in: query
 *         name: goalGroupId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search within notes
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, date, currentWeight, progressPercent, mealCompletionPercent, workoutCompletionPercent]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Diet progress records fetched successfully
 */
router.get(
"/my",
protect,
getMyProgress
);

/**
 * @swagger
 * /api/diet-progress/user/{userId}:
 *   get:
 *     summary: Get Diet Progress For A Specific User (Admin/Trainer)
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Diet progress records fetched successfully
 *       404:
 *         description: User not found
 */
router.get(
"/user/:userId",
protect,
authorize(
"admin",
"trainer"
),
getUserProgress
);

/**
 * @swagger
 * /api/diet-progress/weekly:
 *   get:
 *     summary: Get Weekly Diet Progress
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Admin/Trainer only - view another user's weekly progress
 *     responses:
 *       200:
 *         description: Weekly progress fetched successfully
 */
router.get(
"/weekly",
protect,
getWeeklyProgress
);

/**
 * @swagger
 * /api/diet-progress/monthly:
 *   get:
 *     summary: Get Monthly Diet Progress
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Admin/Trainer only - view another user's monthly progress
 *     responses:
 *       200:
 *         description: Monthly progress fetched successfully
 */
router.get(
"/monthly",
protect,
getMonthlyProgress
);

/**
 * @swagger
 * /api/diet-progress/graph:
 *   get:
 *     summary: Get Diet Progress Graph Data
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [weight, calories, waterIntake, mealCompletion, workoutCompletion]
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Admin/Trainer only - view another user's graph data
 *     responses:
 *       200:
 *         description: Graph data fetched successfully
 */
router.get(
"/graph",
protect,
getGraphData
);

/**
 * @swagger
 * /api/diet-progress/dashboard:
 *   get:
 *     summary: Get Diet Progress Dashboard Summary
 *     tags: [Diet Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Admin/Trainer only - view another user's dashboard summary
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 */
router.get(
"/dashboard",
protect,
getDashboardSummary
);

module.exports =
router;
