import 'package:flutter/material.dart';

class ProfileBanner extends StatelessWidget {
  const ProfileBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Fondo de color en lugar de imagen
        Container(
          height: 200,
          color: Colors.green.shade400, // Puedes cambiar este color
        ),

        // Overlay oscuro
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withOpacity(0.2),
                  Colors.black.withOpacity(0.6),
                ],
              ),
            ),
          ),
        ),

        // Contenido superior
        Positioned(
          top: 24,
          left: 24,
          right: 24,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  '• ACTIVO',
                  style: TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Row(
                children: [
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.download_outlined, size: 16),
                    label: const Text('Exportar Ficha', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit_outlined, size: 16),
                    label: const Text('Editar Perfil', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[800],
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Avatar y texto
        Positioned(
          bottom: -40,
          left: 0,
          right: 0,
          child: Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(40),
                  border: Border.all(color: Colors.white, width: 4),
                ),
                child: const Icon(
                  Icons.lock,
                  color: Colors.amber,
                  size: 40,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Rancho El Búfalo Dorado',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Rancho ganadero especializado en la cría y engorda de ganado bovino de alta calidad.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}