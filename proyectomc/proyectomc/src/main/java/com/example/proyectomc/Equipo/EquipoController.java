package com.example.proyectomc.Equipo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/equipo")
public class EquipoController {
    @Autowired
    private EquipoRepository equipoRepository;

    @GetMapping
    public List<Equipo> getAllEquipos() {
        return equipoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Equipo getEquipoById(@PathVariable int id) {
        return equipoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Equipo createEquipo(@Valid @RequestBody Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    @PutMapping("/{id}")
    public Equipo updateEquipo(@Valid @PathVariable int id, @RequestBody Equipo equipoDetails) {
        Equipo equipo = equipoRepository.findById(id).orElseThrow();
        equipo.setNombre(equipoDetails.getNombre());
        equipo.setCiudad(equipoDetails.getCiudad());
        return equipoRepository.save(equipo);
    }

    @DeleteMapping("/{id}")
    public void deleteEquipo(@PathVariable int id) {
        equipoRepository.deleteById(id);
    }
}
