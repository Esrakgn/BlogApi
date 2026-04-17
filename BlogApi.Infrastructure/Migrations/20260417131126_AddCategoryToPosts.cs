using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryToPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var defaultCategoryId = new Guid("11111111-1111-1111-1111-111111111111");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.Sql($"""
                INSERT INTO [Categories] ([Id], [Name])
                VALUES ('{defaultCategoryId}', 'General');
            """);
            // eski postları bağlamak için varsayılan bir kategori oluşturuyoruz

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Posts",
                type: "uniqueidentifier",
                nullable: true);
            // önce nullable ekliyoruz ki eski veriler yüzünden migration patlamasın

            migrationBuilder.Sql($"""
                UPDATE [Posts]
                SET [CategoryId] = '{defaultCategoryId}'
                WHERE [CategoryId] IS NULL;
            """);
            // eski postların categoryId alanını default kategori ile dolduruyoruz

            migrationBuilder.AlterColumn<Guid>(
                name: "CategoryId",
                table: "Posts",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
            // tüm eski veriler dolduktan sonra kolonu zorunlu hale getiriyoruz

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CategoryId",
                table: "Posts",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Categories_CategoryId",
                table: "Posts",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Categories_CategoryId",
                table: "Posts");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Posts_CategoryId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Posts");
        }
    }
}
