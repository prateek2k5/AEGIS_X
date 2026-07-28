"""
============================================================
File        : report_generator.py
Project     : AEGIS-X

Description :
Generate professional PDF security reports.
============================================================
"""

from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def generate_report(data, filename="security_report.pdf"):
    """
    Generate AEGIS-X PDF Security Report.
    """

    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["BodyText"]

    pdf = SimpleDocTemplate(filename)

    story = []

    # ======================================================
    # Title
    # ======================================================

    story.append(
        Paragraph(
            "AEGIS-X Security Report",
            title_style
        )
    )

    story.append(
        Paragraph(
            f"Generated : {datetime.now().strftime('%d %b %Y | %I:%M:%S %p')}",
            normal_style
        )
    )

    story.append(Spacer(1, 20))

    # ======================================================
    # System Overview
    # ======================================================

    story.append(
        Paragraph(
            "System Overview",
            heading_style
        )
    )

    system_table = Table(
        [
            ["Metric", "Value"],
            ["CPU Usage", f"{data['cpu']['cpu_usage_percent']} %"],
            ["Memory Usage", f"{data['memory']['usage_percent']} %"],
            ["Disk Usage", f"{data['disk']['usage_percent']} %"],
            ["Network Upload", f"{data['network']['bytes_sent_mb']:.2f} MB"],
            ["Network Download", f"{data['network']['bytes_received_mb']:.2f} MB"],
        ],
        colWidths=[200, 180],
    )

    system_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ]
        )
    )

    story.append(system_table)

    story.append(Spacer(1, 25))

    # ======================================================
    # Highest Risk Process
    # ======================================================

    highest = None

    for process in data["processes"]:
        if process["risk"] == "HIGH":
            highest = process
            break

    if highest:

        story.append(
            Paragraph(
                "Highest Risk Process",
                heading_style
            )
        )

        process_table = Table(
            [
                ["Field", "Value"],
                ["Process", highest["name"]],
                ["PID", str(highest["pid"])],
                ["CPU Usage", f"{highest['cpu']} %"],
                ["Memory", f"{highest['memory_mb']} MB"],
                ["Risk", highest["risk"]],
                ["Reason", highest["reason"]],
            ],
            colWidths=[180, 200],
        )

        process_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.red),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ]
            )
        )

        story.append(process_table)

        story.append(Spacer(1, 25))

        # ==================================================
        # AI Analysis
        # ==================================================

        story.append(
            Paragraph(
                "AI Security Analysis",
                heading_style
            )
        )

        ai_text = highest["ai_message"].replace("\n", "<br/><br/>")

        story.append(
            Paragraph(
                ai_text,
                normal_style
            )
        )

    else:

        story.append(
            Paragraph(
                "No HIGH risk process detected.",
                normal_style
            )
        )

    story.append(Spacer(1, 30))

    # ======================================================
    # Footer
    # ======================================================

    story.append(
        Paragraph(
            "<b>Generated by AEGIS-X</b><br/>"
            "Autonomous AI Security Operations Center",
            normal_style,
        )
    )

    pdf.build(story)

    return filename