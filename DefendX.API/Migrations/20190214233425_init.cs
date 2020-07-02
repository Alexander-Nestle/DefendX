using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DefendX.API.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Type = table.Column<string>(maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Service",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Service", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Unit",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ParentId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    UnitAbbreviation = table.Column<string>(maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AccountTypeId = table.Column<int>(nullable: false),
                    LastLoginDate = table.Column<DateTime>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_AccountType_AccountTypeId",
                        column: x => x.AccountTypeId,
                        principalTable: "AccountType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Rank",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ServiceId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 15, nullable: false),
                    Tier = table.Column<string>(maxLength: 10, nullable: false),
                    Grade = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rank", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rank_Service_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Service",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    DodId = table.Column<long>(nullable: false),
                    AccountId = table.Column<int>(nullable: false),
                    UnitId = table.Column<int>(nullable: true),
                    ServiceId = table.Column<int>(nullable: true),
                    RankId = table.Column<int>(nullable: true),
                    Name_FirstName = table.Column<string>(maxLength: 50, nullable: false),
                    Name_MiddleInitial = table.Column<string>(maxLength: 1, nullable: true),
                    Name_LastName = table.Column<string>(maxLength: 50, nullable: false),
                    ContactInfo_DsnPhone = table.Column<string>(maxLength: 25, nullable: true),
                    ContactInfo_CommPhone = table.Column<string>(maxLength: 25, nullable: true),
                    ContactInfo_Email = table.Column<string>(maxLength: 100, nullable: true),
                    SignatureData = table.Column<string>(unicode: false, nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.DodId);
                    table.ForeignKey(
                        name: "FK_User_Account_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Rank_RankId",
                        column: x => x.RankId,
                        principalTable: "Rank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_User_Service_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Service",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_User_Unit_UnitId",
                        column: x => x.UnitId,
                        principalTable: "Unit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "SofaLicense",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DodId = table.Column<long>(nullable: false),
                    SponsorId = table.Column<int>(nullable: true),
                    UnitId = table.Column<int>(nullable: true),
                    RankId = table.Column<int>(nullable: true),
                    ServiceId = table.Column<int>(nullable: false),
                    LastEditedById = table.Column<long>(nullable: false),
                    Name_FirstName = table.Column<string>(maxLength: 50, nullable: false),
                    Name_MiddleInitial = table.Column<string>(maxLength: 1, nullable: true),
                    Name_LastName = table.Column<string>(maxLength: 50, nullable: false),
                    PersonalInfo_Gender = table.Column<string>(maxLength: 25, nullable: false),
                    PersonalInfo_DoB = table.Column<DateTime>(nullable: false),
                    PersonalInfo_Height = table.Column<int>(nullable: false),
                    PersonalInfo_Weight = table.Column<int>(nullable: false),
                    PersonalInfo_HairColor = table.Column<string>(maxLength: 15, nullable: false),
                    PersonalInfo_EyeColor = table.Column<string>(maxLength: 15, nullable: false),
                    DriverRestrictions_Glasses = table.Column<bool>(nullable: false),
                    DriverRestrictions_AutoJeep = table.Column<bool>(nullable: false),
                    DriverRestrictions_MotorCycle = table.Column<bool>(nullable: false),
                    DriverRestrictions_Motor = table.Column<bool>(nullable: false),
                    DriverRestrictions_Other = table.Column<bool>(nullable: false),
                    DateUpdated = table.Column<DateTime>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateExpired = table.Column<DateTime>(nullable: false),
                    SignatureData = table.Column<string>(unicode: false, nullable: false),
                    PermitNumber = table.Column<string>(maxLength: 100, nullable: false),
                    IsAuthenticated = table.Column<bool>(nullable: false),
                    Remarks = table.Column<string>(maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SofaLicense", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SofaLicense_User_LastEditedById",
                        column: x => x.LastEditedById,
                        principalTable: "User",
                        principalColumn: "DodId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_SofaLicense_Rank_RankId",
                        column: x => x.RankId,
                        principalTable: "Rank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_SofaLicense_Service_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Service",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_SofaLicense_SofaLicense_SponsorId",
                        column: x => x.SponsorId,
                        principalTable: "SofaLicense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SofaLicense_Unit_UnitId",
                        column: x => x.UnitId,
                        principalTable: "Unit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "PrintQueue",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<long>(nullable: false),
                    LicenseId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrintQueue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrintQueue_SofaLicense_LicenseId",
                        column: x => x.LicenseId,
                        principalTable: "SofaLicense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrintQueue_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "DodId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_AccountTypeId",
                table: "Account",
                column: "AccountTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PrintQueue_LicenseId",
                table: "PrintQueue",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_PrintQueue_UserId",
                table: "PrintQueue",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rank_ServiceId",
                table: "Rank",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicense_LastEditedById",
                table: "SofaLicense",
                column: "LastEditedById");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicense_RankId",
                table: "SofaLicense",
                column: "RankId");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicense_ServiceId",
                table: "SofaLicense",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicense_SponsorId",
                table: "SofaLicense",
                column: "SponsorId");

            migrationBuilder.CreateIndex(
                name: "IX_SofaLicense_UnitId",
                table: "SofaLicense",
                column: "UnitId");

            migrationBuilder.CreateIndex(
                name: "IX_User_AccountId",
                table: "User",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_User_RankId",
                table: "User",
                column: "RankId");

            migrationBuilder.CreateIndex(
                name: "IX_User_ServiceId",
                table: "User",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_User_UnitId",
                table: "User",
                column: "UnitId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrintQueue");

            migrationBuilder.DropTable(
                name: "SofaLicense");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Rank");

            migrationBuilder.DropTable(
                name: "Unit");

            migrationBuilder.DropTable(
                name: "AccountType");

            migrationBuilder.DropTable(
                name: "Service");
        }
    }
}
