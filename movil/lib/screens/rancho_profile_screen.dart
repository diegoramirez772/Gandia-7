import 'package:flutter/material.dart';
import '../models/rancho.dart';
import '../widgets/profile_banner.dart';
import '../widgets/stats_card.dart';

class RanchoProfileScreen extends StatelessWidget {
  const RanchoProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final rancho = Rancho.ejemplo();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Perfil de Rancho'),
        centerTitle: true,
      ),
      body: SafeArea( // 👈 Evita que la barra del sistema tape contenido
        child: SingleChildScrollView(
          child: Column(
            children: [
              const ProfileBanner(),
              const SizedBox(height: 32),

              // Primera fila de tarjetas
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: 'Información Básica',
                        icon: Icons.person_outline,
                        value: rancho.uppid,
                        subtitle: 'UPP (Identificador)',
                        valueColor: Colors.black,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: StatsCard(
                        title: 'Estado Sanitario',
                        icon: Icons.health_and_safety_outlined,
                        value: '${rancho.cumplimiento}%',
                        subtitle: 'Cumplimiento\nTrazabilidad',
                        valueColor: Colors.green,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: StatsCard(
                        title: 'Datos Operativos',
                        icon: Icons.monetization_on_outlined,
                        value: rancho.totalAnimales.toString(),
                        subtitle: 'Total Animales',
                        valueColor: Colors.black,
                      ),
                    ),
                  ],
                ),
              ),

              // Segunda fila de tarjetas
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: '',
                        icon: Icons.location_on_outlined,
                        value: 'Zacatecas, MX',
                        subtitle: 'Ubicación',
                        valueColor: Colors.black,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: StatsCard(
                        title: '',
                        icon: Icons.calendar_today_outlined,
                        value: '2020',
                        subtitle: 'Año de Fundación',
                        valueColor: Colors.black,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: StatsCard(
                        title: '',
                        icon: Icons.group_outlined,
                        value: rancho.corrales.toString(),
                        subtitle: 'Corrales',
                        valueColor: Colors.black,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 64),
            ],
          ),
        ),
      ),
    );
  }
}