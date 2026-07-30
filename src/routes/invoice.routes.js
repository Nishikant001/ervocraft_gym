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

const {

 getInvoice,

 downloadInvoice,

 emailInvoice,

 adminInvoiceList,

 myInvoiceHistory

}
=
require(
"../controllers/invoice.controller"
);

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice generation & retrieval APIs
 */

/**
 * @swagger
 * /api/invoices/admin:
 *   get:
 *     summary: Admin Invoice List
 *     description: Lists all invoices across all users. Admin only.
 *     tags: [Invoices]
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
 *           enum: [paid, pending, cancelled, refunded]
 *       - in: query
 *         name: userId
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
 *         description: Search by invoice number or transaction id
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
 *       403:
 *         description: Permission denied
 */
router.get(
"/admin",
protect,
authorize("admin"),
adminInvoiceList
);

/**
 * @swagger
 * /api/invoices/my:
 *   get:
 *     summary: My Invoice History
 *     description: Lists the logged-in user's own invoices.
 *     tags: [Invoices]
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
 *           enum: [paid, pending, cancelled, refunded]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by invoice number or transaction id
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
 */
router.get(
"/my",
protect,
myInvoiceHistory
);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get Invoice
 *     tags: [Invoices]
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
 *         description: Invoice fetched successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Invoice not found
 */
router.get(
"/:id",
protect,
getInvoice
);

/**
 * @swagger
 * /api/invoices/{id}/download:
 *   get:
 *     summary: Download Invoice PDF
 *     tags: [Invoices]
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
 *         description: Invoice PDF stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Invoice not found
 */
router.get(
"/:id/download",
protect,
downloadInvoice
);

/**
 * @swagger
 * /api/invoices/{id}/email:
 *   post:
 *     summary: Email Invoice
 *     description: Emails the invoice PDF to the invoice owner's registered email address.
 *     tags: [Invoices]
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
 *         description: Invoice emailed successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Invoice not found
 */
router.post(
"/:id/email",
protect,
emailInvoice
);

module.exports =
router;
