const { Tarea } = require("../models/Tareas.js");
  
const tareasLista = async (req, res) => {
    try {
        const userActive = req.user.id;
        if (userActive) {
            const tareasFiltradas = await Tarea.find({ usuarioId: userActive });
            if (tareasFiltradas.length > 0) {
                const hoy = new Date();
                const tareasActivas = [];

                for (let i of tareasFiltradas) {
                    const tareaFecha = new Date(i.fecha);
                    if (tareaFecha.getTime() < hoy.getTime()) {
                        await Tarea.findByIdAndDelete(i._id);
                    } else {
                        tareasActivas.push(i);
                    }
                }

                // Responder con las tareas activas
                return res.json(tareasActivas);
            }

            return res.status(404).json({ msg: 'Tareas no encontradas' });
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error al obtener las tareas', error: err.message });
    }
};


const crearTarea = async (req, res) => {
    const userActive = req.user.id;
    try {
        const { concepto, fecha } = req.body;
        const nuevaTarea = await Tarea.create({
            concepto,
            usuarioId: userActive,
            fecha: fecha ? fecha : Date.now()
        });

        res.json({ msg: 'Tarea creada exitosamente', tarea: nuevaTarea });
    } catch (err) {
        res.status(500).json({ msg: `Error al crear la tarea: ${err.message}` });
    }
};

const eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findByIdAndDelete(id);

        if (!tarea) return res.status(404).json({ msg: 'Tarea no encontrada' });

        res.json({ msg: 'Tarea eliminada exitosamente!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al eliminar tarea', error: err.message });
    }
};

const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { concepto } = req.body;

        const tarea = await Tarea.findByIdAndUpdate(id, { concepto }, { new: true });

        if (!tarea) return res.status(404).json({ msg: 'No se pudo actualizar la tarea' });

        res.json({ msg: 'Tarea actualizada correctamente!', tarea });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar la tarea', error: err.message });
    }
};

module.exports = { tareasLista, crearTarea, eliminarTarea, actualizarTarea };
