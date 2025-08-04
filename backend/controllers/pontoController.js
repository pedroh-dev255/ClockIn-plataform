const { registerDigital, registroFacial, registroPin } = require('../services/pontoService');



async function register(req, res) {
    const { deviceId, tipo, data, loc} = req.body;

    if (!deviceId || !tipo || !data) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos obrigatórios'
        });
    }

    try {
        let response;

        // definir tipo de registro
        switch (tipo) {
            case 'digital':
                response = await registerDigital(deviceId, data, loc);
                break;
            case 'facial':
                response = await registroFacial(deviceId, data, loc);
                break;
            case 'pin':
                response = await registroPin(deviceId, data, loc);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de registro inválido'
                });
        }

        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao registrar ponto'
            });
        }

        res.status(200).json({
            success: true,
            ponto: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar ponto: ' + error.message
        });
        
    }
    

}


module.exports = {
    register
};