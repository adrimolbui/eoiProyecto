package com.example.proyectomc.Jugador;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectomc.Equipo.Equipo;
import com.example.proyectomc.Equipo.EquipoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jugador")
public class JugadorController {
    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    @GetMapping
    public List<Jugador> getAllJugadores() {
        return jugadorRepository.findAllOrderByEquipo();
    }

    @GetMapping("/{id}")
    public Jugador getJugadorById(@PathVariable int id) {
        return jugadorRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Jugador createJugador(@RequestBody @Valid Jugador jugador) {
        Optional<Equipo> equipoOptional = equipoRepository.findById(jugador.getEquipo().getId());
        if (equipoOptional.isPresent()) {
            jugador.setEquipo(equipoOptional.get());
            return jugadorRepository.save(jugador);
        } else {
            throw new RuntimeException("Equipo no encontrado con id: " + jugador.getEquipo().getId());
        }
    }

    @PutMapping("/{id}")
    public Jugador updateJugador(@PathVariable int id, @Valid @RequestBody Jugador jugadorDetails) {
        // Buscar el jugador
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con id: " + id));

        // Actualizar datos del jugador
        jugador.setNombre(jugadorDetails.getNombre());
        jugador.setFechaNacimiento(jugadorDetails.getFechaNacimiento());
        jugador.setNumeroCamiseta(jugadorDetails.getNumeroCamiseta());
        jugador.setPosicion(jugadorDetails.getPosicion());

        // Buscar equipo y actualizar si es necesario
        Optional<Equipo> equipoOptional = equipoRepository.findById(jugadorDetails.getEquipo().getId());
        if (equipoOptional.isPresent()) {
            jugador.setEquipo(equipoOptional.get());
        } else {
            throw new RuntimeException("Equipo no encontrado con id: " + jugadorDetails.getEquipo().getId());
        }

        // Actualizar goles
        jugador.setGoles(jugadorDetails.getGoles());

        // Guardar cambios
        return jugadorRepository.save(jugador);
    }

    @PutMapping("/{id}/goles/{goles}")
    public Jugador addGoles(@PathVariable int id, @PathVariable int goles) {
        Jugador jugador = jugadorRepository.findById(id).orElseThrow();
        jugador.setGoles(jugador.getGoles() + goles);
        return jugadorRepository.save(jugador);
    }

    @GetMapping("/topscorers")
    public List<Jugador> getTop10Scorers() {
        return jugadorRepository.findTop10ByDesc();
    }

    @DeleteMapping("/{id}")
    public void deleteJugador(@PathVariable int id) {
        jugadorRepository.deleteById(id);
    }

}
