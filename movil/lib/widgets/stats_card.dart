import 'package:flutter/material.dart';

class StatsCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String value;
  final String subtitle;
  final Color? valueColor;

  const StatsCard({
    super.key,
    required this.title,
    required this.icon,
    required this.value,
    required this.subtitle,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: Colors.grey[700]),
                ),
                const SizedBox(width: 12),
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: valueColor ?? Colors.black,
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}