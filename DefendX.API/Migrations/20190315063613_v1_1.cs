using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DefendX.API.Migrations
{
    public partial class v1_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SofaLicense_Unit_UnitId",
                table: "SofaLicense");

            migrationBuilder.AlterColumn<int>(
                name: "UnitId",
                table: "SofaLicense",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DriverRestrictions_OnBaseOnly",
                table: "SofaLicense",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DriverRestrictions_Tdy",
                table: "SofaLicense",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "SofaLicenseIssue",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<long>(nullable: false),
                    IssueDate = table.Column<DateTime>(nullable: false),
                    SofaLicenseId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SofaLicenseIssue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SofaLicenseIssue_SofaLicense_SofaLicenseId",
                        column: x => x.SofaLicenseId,
                        principalTable: "SofaLicense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SofaLicenseIssue_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "DodId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicenseIssue_SofaLicenseId",
                table: "SofaLicenseIssue",
                column: "SofaLicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicenseIssue_UserId",
                table: "SofaLicenseIssue",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SofaLicense_Unit_UnitId",
                table: "SofaLicense",
                column: "UnitId",
                principalTable: "Unit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SofaLicense_Unit_UnitId",
                table: "SofaLicense");

            migrationBuilder.DropTable(
                name: "SofaLicenseIssue");

            migrationBuilder.DropColumn(
                name: "DriverRestrictions_OnBaseOnly",
                table: "SofaLicense");

            migrationBuilder.DropColumn(
                name: "DriverRestrictions_Tdy",
                table: "SofaLicense");

            migrationBuilder.AlterColumn<int>(
                name: "UnitId",
                table: "SofaLicense",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_SofaLicense_Unit_UnitId",
                table: "SofaLicense",
                column: "UnitId",
                principalTable: "Unit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
