using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Priority1.ToDo.Core.Migrations
{
    public partial class AddTodoLists : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TodoLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoLists", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "TodoLists",
                columns: new[] { "Id", "Name", "CreateDate", "UpdateDate" },
                values: new object[]
                {
                    1,
                    "My List",
                    new DateTime(2026, 11, 16, 5, 15, 0, DateTimeKind.Utc),
                    new DateTime(2026, 11, 16, 5, 15, 0, DateTimeKind.Utc)
                });

            migrationBuilder.AddColumn<int>(
                name: "ListId",
                table: "Todos",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("UPDATE [Todos] SET [ListId] = 1;");

            migrationBuilder.AlterColumn<int>(
                name: "ListId",
                table: "Todos",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ListId",
                table: "Todos",
                column: "ListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodoLists_ListId",
                table: "Todos",
                column: "ListId",
                principalTable: "TodoLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodoLists_ListId",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_ListId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "ListId",
                table: "Todos");

            migrationBuilder.DropTable(
                name: "TodoLists");
        }
    }
}
