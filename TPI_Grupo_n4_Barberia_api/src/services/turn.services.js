import { Turno } from "../models/Turn.js"

// Obtener todo el listado de turnos agendados
export const getAllTurns = async (req, res) => {
    try {
        const turns = await Turno.findAll();
        res.json(turns);
    } catch (error) {
        res.status(500).send("Error al obtener la agenda de turnos: " + error.message);
    }
};

//Obtener un turno específico usando su ID
export const getTurnById = async (req, res) => {
    try {
        const { id } = req.params;
        const turn = await Turno.findByPk(id);
        
        if (!turn) {
            return res.status(404).send("Turno no encontrado.");
        }
        res.json(turn);
    } catch (error) {
        res.status(500).send("Error al buscar el turno: " + error.message);
    }
};

//Registrar un nuevo turno
export const createTurn = async (req, res) => {
    try {
        const { id_user, id_barber, turn_date, turn_time } = req.body;

        //Validamos que por lo menos se asigne un cliente, un barbero y el momento del turno
        if (!id_user || !id_barber || !turn_date || !turn_time) {
            return res.status(400).send("Faltan datos obligatorios para agendar el turno (Cliente, Barbero, Fecha y Hora).");
        }

        const newTurn = await Turno.create({
            id_user,
            id_barber,
            turn_date,
            turn_time,
            status: "Pendiente" //Se inicializa por defecto en Pendiente tal como pide el modelo
        });

        res.json(newTurn);
    } catch (error) {
        res.status(500).send("Error al agendar el turno: " + error.message);
    }
};

//Modificar el estado de un turno(Pasarlo a 'Cancelado' o 'Finalizado')
export const updateTurnStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; //El frontend manda el nuevo string ('Cancelado' o 'Finalizado')

        //Validamos que el estado ingresado sea uno de los 3 permitidos en el ENUM del modelo
        const validStatuses = ['Pendiente', 'Cancelado', 'Finalizado'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).send("El estado enviado no es válido. Debe ser 'Pendiente', 'Cancelado' o 'Finalizado'.");
        }

        const turn = await Turno.findByPk(id);
        if (!turn) {
            return res.status(404).send("Turno no encontrado.");
        }

        await turn.update({ status });
        res.send(`El estado del turno ha sido actualizado a '${status}' con éxito.`);
    } catch (error) {
        res.status(500).send("Error al actualizar el estado del turno: " + error.message);
    }
};

//Eliminar un registro de turno permanentemente
export const deleteTurn = async (req, res) => {
    try {
        const { id } = req.params;
        const turn = await Turno.findByPk(id);
        
        if (!turn) {
            return res.status(404).send("Turno no encontrado.");
        }

        await turn.destroy();
        res.send("El turno ha sido borrado del sistema correctamente.");
    } catch (error) {
        res.status(500).send("Error al eliminar el turno: " + error.message);
    }
};