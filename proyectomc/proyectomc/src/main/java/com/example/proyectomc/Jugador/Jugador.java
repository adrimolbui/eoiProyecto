package com.example.proyectomc.Jugador;

import java.util.Date;
import com.example.proyectomc.Equipo.Equipo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "El nombre del jugador no puede estar vacío")
    private String nombre;

    @Temporal(TemporalType.DATE)
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    @NotNull(message = "La fecha de nacimiento no puede ser nula")
    private Date fechaNacimiento;

    @Min(value = 1, message = "El número de camiseta debe ser mayor o igual a 1")
    private int numeroCamiseta;

    @NotBlank(message = "La posición del jugador no puede estar vacía")
    private String posicion;

    @ManyToOne
    @JoinColumn(name = "equipo_id")
    @JsonIgnoreProperties("jugadores")
    private Equipo equipo;

    private Integer goles = 0;
}