const paypal = require('@paypal/checkout-server-sdk');

const clientId = 'AXAl-vVyydICzwStxvMLyA53LuFjVrRONwiZWU5kLqzjOgQGLuKWJ0ajOlzpmiYLi5ea8QrxZ9PP0TG1'; // Thay thế bằng Client ID của bạn
const clientSecret = 'EJT5yyTPgJrsiWJerUbb4BGD2swipXXATg5ui5WAIJN5h-mn1zwqKfNTp28fg9farK7H1aFzsct59_NM'; // Thay thế bằng Secret của bạn

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// // Hàm tạo đơn hàng
// const createOrder = async (req, res) => {
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.requestBody({
//         intent: 'CAPTURE',
//         purchase_units: [{
//             amount: {
//                 currency_code: 'USD',
//                 value: '50.00', // Số tiền thanh toán
//             },
//         }],
//     });

//     try {
//         const order = await client.execute(request);
//         res.json({ id: order.result.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating order');
//     }
// };

// Hàm tạo đơn hàng
const createOrder = async (req, res) => {
    const { amount } = req.body; // Lấy amount từ req.body

    // Kiểm tra xem amount có được truyền từ frontend hay không
    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({   
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount, // Sử dụng amount từ req.body
            },
        }],
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
};


// Xuất hàm tạo đơn hàng
module.exports = { createOrder };
