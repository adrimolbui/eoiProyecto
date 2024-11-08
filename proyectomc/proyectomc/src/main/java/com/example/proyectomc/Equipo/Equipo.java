package com.example.proyectomc.Equipo;

import java.util.List;
import com.example.proyectomc.Jugador.Jugador;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "El nombre del equipo no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre del equipo debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La ciudad no puede estar vacía")
    private String ciudad;

    @OneToMany(mappedBy = "equipo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("equipo")
    private List<Jugador> jugadores;
}

